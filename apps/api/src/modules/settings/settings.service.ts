import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Setting } from "./entities/setting.entity";
import { UpdatePaymentDestinationDto } from "./dto/update-payment-destination.dto";
import type { EnvConfig } from "../../config/env";
import type { PaymentDestinationAccount } from "@roohbakhsh/shared";

const PAYMENT_DEST_KEY = "payment_destination";

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly repo: Repository<Setting>,
    private readonly config: ConfigService<EnvConfig>,
  ) {}

  async getPaymentDestination(): Promise<PaymentDestinationAccount> {
    const row = await this.repo.findOne({ where: { key: PAYMENT_DEST_KEY } });
    if (row) return JSON.parse(row.value) as PaymentDestinationAccount;

    // fallback به env در صورت نبود رکورد در دیتابیس
    return {
      bankName: this.config.get("PAYMENT_DESTINATION_BANK_NAME", { infer: true }) ?? "",
      accountNumber: this.config.get("PAYMENT_DESTINATION_ACCOUNT_NUMBER", { infer: true }) ?? "",
      cardNumber: this.config.get("PAYMENT_DESTINATION_CARD_NUMBER", { infer: true }) ?? "",
      accountHolder: this.config.get("PAYMENT_DESTINATION_ACCOUNT_HOLDER", { infer: true }) ?? "",
    };
  }

  async updatePaymentDestination(dto: UpdatePaymentDestinationDto): Promise<PaymentDestinationAccount> {
    const value: PaymentDestinationAccount = {
      cardNumber: dto.cardNumber,
      accountHolder: dto.accountHolder,
      bankName: dto.bankName,
      accountNumber: dto.accountNumber ?? "",
    };
    await this.repo.save({ key: PAYMENT_DEST_KEY, value: JSON.stringify(value) });
    return value;
  }
}
