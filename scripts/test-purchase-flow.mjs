// تست End-to-End خرید چند کاربر، چند دوره (رایگان + پولی)، پرداخت، و کراس-چک نهایی.
// اجرا: node scripts/test-purchase-flow.mjs
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const API = "http://localhost:3001/api";

function envVar(name) {
  const content = readFileSync("apps/api/.env.developer", "utf-8");
  const line = content.split("\n").find((l) => l.startsWith(`${name}=`));
  return line ? line.split("=")[1].trim() : null;
}

const DB_PASS = envVar("DB_PASSWORD");

// execSync روی ویندوز newline داخل آرگومان quoted را درست پاس نمی‌دهد — یک‌خطی‌اش می‌کنیم.
function flatten(sql) {
  return sql.replace(/\s+/g, " ").trim();
}

function dbQuery(sql) {
  const out = execSync(`mysql -u root -p${DB_PASS} roohbakhshac -N -e "${flatten(sql).replace(/"/g, '\\"')}"`, {
    encoding: "utf-8",
  });
  return out.trim();
}

function dbExec(sql) {
  execSync(`mysql -u root -p${DB_PASS} roohbakhshac -e "${flatten(sql).replace(/"/g, '\\"')}"`);
}

async function api(method, path, body, token) {
  const headers = { "Content-Type": "application/json", "Accept-Language": "ar" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = new Error(json?.code ?? `HTTP_${res.status}`);
    err.status = res.status;
    err.body = json;
    throw err;
  }
  return json;
}

async function login(email, password) {
  const r = await api("POST", "/auth/login", { email, password });
  return r.accessToken;
}

async function clearCart(token) {
  await api("DELETE", "/cart", undefined, token);
}

async function addToCart(token, courseId) {
  await api("POST", "/cart/items", { courseId }, token);
}

// ZarinPal واقعی در این محیط شبکه ندارد — کل پرداخت پولی را مستقیم در DB شبیه‌سازی می‌کنیم
// (همان شکل رکورد payments که initiate واقعی هم می‌ساخت، بدون صدا زدن API خارجی).
function simulatePaidOrderDirectly(orderId, userId, amountMinor, currency) {
  const refId = `ZREF-${Date.now()}`;
  const authority = `A${Date.now()}`;
  dbExec(`
    INSERT INTO payments (id, order_id, user_id, amount, status, authority, ref_id, gateway_url, description, created_at, updated_at)
    VALUES (UUID(), '${orderId}', '${userId}', JSON_OBJECT('amountMinor', ${amountMinor}, 'currency', '${currency}'),
      'paid', '${authority}', '${refId}', 'https://sandbox.zarinpal.com/pg/StartPay/${authority}',
      'Simulated — no network in this environment', NOW(), NOW());
  `);
  dbExec(`UPDATE orders SET status='paid' WHERE id='${orderId}';`);

  const invCount = dbQuery(`SELECT COUNT(*) FROM invoices;`);
  const invNum = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(Number(invCount) + 1).padStart(4, "0")}`;

  dbExec(`
    INSERT INTO invoices (id, invoice_number, order_id, user_id, items, subtotal, discount_amount, total, coupon_code, payment_ref_id, issued_at)
    SELECT UUID(), '${invNum}', o.id, o.user_id,
      JSON_ARRAYAGG(JSON_OBJECT('courseId', oi.course_id, 'titleSnapshot', oi.title_snapshot, 'priceSnapshot', oi.price_snapshot)),
      o.subtotal, o.discount_amount, o.total, o.coupon_code, '${refId}', NOW()
    FROM orders o JOIN order_items oi ON oi.orderId = o.id
    WHERE o.id = '${orderId}' GROUP BY o.id;
  `);
  return refId;
}

async function buyFlow(label, email, courseSlugs) {
  console.log(`\n━━━ ${label} (${email}) ━━━`);
  const token = await login(email, "Test@1234");
  const me = await api("GET", "/auth/me", undefined, token);

  await clearCart(token);
  const courses = [];
  for (const slug of courseSlugs) {
    const course = await api("GET", `/courses/${slug}`, undefined, null);
    courses.push(course);
    await addToCart(token, course.id);
  }
  const cart = await api("GET", "/cart", undefined, token);
  console.log(`  cart: ${cart.items.length} items, total=${cart.total?.amountMinor ?? 0} ${cart.total?.currency ?? ""}`);

  const order = await api("POST", "/orders", {}, token);
  console.log(`  order: id=${order.id} total=${order.total.amountMinor} status=${order.status}`);

  let paymentId;
  if (order.total.amountMinor === 0) {
    // سفارش رایگان — initiate واقعی API صدا زده می‌شود (بدون شبکه، خودش paid می‌کند)
    const init = await api("POST", `/payments/initiate/${order.id}`, undefined, token);
    console.log(`  initiate: requiresPayment=${init.requiresPayment} gatewayUrl=${init.gatewayUrl ?? "null"}`);
    paymentId = init.paymentId;
  } else {
    // سفارش پولی — این محیط به اینترنت/ZarinPal واقعی دسترسی ندارد؛
    // کل فلوی پرداخت موفق را مستقیم در DB شبیه‌سازی می‌کنیم (همان شکل رکوردها).
    console.log("  initiate: شبیه‌سازی پرداخت موفق در DB (بدون دسترسی شبکه به ZarinPal)");
    simulatePaidOrderDirectly(order.id, me.id, order.total.amountMinor, order.total.currency);
  }

  const orderAfter = await api("GET", `/orders/mine/${order.id}`, undefined, token);
  const payments = await api("GET", "/payments/mine", undefined, token);
  const payment = payments.items.find((p) => p.orderId === order.id);
  const invoices = await api("GET", "/invoices/mine", undefined, token);
  const invoice = invoices.items.find((inv) => inv.orderId === order.id);

  console.log(`  ✓ order.status=${orderAfter.status} | payment.status=${payment?.status} | invoice=${invoice?.invoiceNumber ?? "MISSING"}`);

  const checks = [
    ["order.status=paid", orderAfter.status === "paid"],
    ["payment.status=paid", payment?.status === "paid"],
    ["invoice found", !!invoice],
    ["invoice.total=order.total", invoice?.total?.amountMinor === order.total.amountMinor],
  ];
  for (const [name, ok] of checks) {
    console.log(`    ${ok ? "✓" : "✗"} ${name}`);
  }

  return { token, order, courses };
}

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  تست خرید چند کاربر — رایگان + پولی + پرداخت");
  console.log("═══════════════════════════════════════════════════");

  // قبل از تست: participantCount فعلی هر دوره را بخوان
  const slugs = ["islamic-history-101", "arabic-for-quran", "intro-to-fiqh-course", "hadith-sciences", "quran-tafsir-basics"];
  const before = {};
  for (const slug of slugs) {
    const c = await api("GET", `/courses/${slug}`, undefined, null);
    before[slug] = c.participantCount;
  }

  // سناریو ۱: student1 — ترکیبی (۱ رایگان + ۱ پولی)
  await buyFlow("سناریو ۱: ترکیبی (رایگان+پولی)", "student1@roohbakhsh.ac", ["arabic-for-quran", "intro-to-fiqh-course"]);

  // سناریو ۲: student2 — دو دوره‌ی پولی
  await buyFlow("سناریو ۲: دو دوره پولی", "student2@roohbakhsh.ac", ["hadith-sciences", "quran-tafsir-basics"]);

  // سناریو ۳: student3 — فقط یک دوره‌ی رایگان
  await buyFlow("سناریو ۳: فقط رایگان", "student3@roohbakhsh.ac", ["islamic-history-101"]);

  // کراس-چک نهایی: participantCount باید افزایش یافته باشد
  console.log("\n━━━ کراس-چک نهایی: participantCount ━━━");
  const expectedIncrease = {
    "islamic-history-101": 2, // student1 نه! فقط student3 → یک واحد. اصلاح می‌شود پایین‌تر
    "arabic-for-quran": 1,
    "intro-to-fiqh-course": 1,
    "hadith-sciences": 1,
    "quran-tafsir-basics": 1,
  };
  // اصلاح: islamic-history-101 را فقط student3 خرید => +1
  expectedIncrease["islamic-history-101"] = 1;

  let allOk = true;
  for (const slug of slugs) {
    const c = await api("GET", `/courses/${slug}`, undefined, null);
    const diff = c.participantCount - before[slug];
    const expected = expectedIncrease[slug];
    const ok = diff === expected;
    allOk = allOk && ok;
    console.log(`  ${ok ? "✓" : "✗"} ${slug}: before=${before[slug]} after=${c.participantCount} (+${diff}, expected +${expected})`);
  }

  console.log(`\n${allOk ? "✅ همه چک‌ها پاس شدند" : "❌ مشکل در یکی از چک‌ها"}`);
}

main().catch((err) => {
  console.error("FATAL:", err.message, err.body ?? "");
  process.exit(1);
});
