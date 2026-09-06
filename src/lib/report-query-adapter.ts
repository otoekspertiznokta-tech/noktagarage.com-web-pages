export interface VerifiedReport {
  reportNumber: string;
  reportDate: string;
  plate: string;
  chassisLast6: string;
  packageName: string;
  dealerName: string;
}

export type ReportQueryResult =
  | { status: "VALID"; report: VerifiedReport }
  | { status: "NOT_FOUND" }
  | { status: "SERVICE_UNAVAILABLE" };

export interface ReportQueryInput {
  plate: string;
  reportNumber: string;
}

export interface ReportQueryAdapter {
  query(input: ReportQueryInput): Promise<ReportQueryResult>;
}

export const normalizePlate = (value: string) =>
  value
    .toLocaleUpperCase("tr-TR")
    .replaceAll("İ", "I")
    .replace(/[^A-Z0-9]/g, "");

export const normalizeReportNumber = (value: string) =>
  value.trim();

const isPlateValid = (plate: string) => {
  const match = plate.match(/^(\d{2})[A-Z]{1,3}\d{2,4}$/);
  if (!match) return false;

  const cityCode = Number(match[1]);
  return cityCode >= 1 && cityCode <= 81;
};

export const validateReportQuery = (input: ReportQueryInput) => {
  const plate = normalizePlate(input.plate);
  const reportNumber = normalizeReportNumber(input.reportNumber);
  const errors: { plate?: string; reportNumber?: string } = {};

  if (!plate) {
    errors.plate = "Plaka alanı zorunludur.";
  } else if (!isPlateValid(plate)) {
    errors.plate = "Geçerli bir Türkiye plakası girin.";
  }

  if (!reportNumber) {
    errors.reportNumber = "Rapor numarası zorunludur.";
  } else if (reportNumber.length > 100) {
    errors.reportNumber = "Rapor numarası en fazla 100 karakter olmalıdır.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    normalized: { plate, reportNumber },
    errors,
  };
};

const reportQueryEndpoint = import.meta.env.PUBLIC_REPORT_QUERY_ENDPOINT?.trim()
  || "https://panel.noktagarage.com/api/public/report-query";

const isVerifiedReport = (value: unknown): value is VerifiedReport => {
  if (!value || typeof value !== "object") return false;
  const report = value as Record<string, unknown>;
  return ["reportNumber", "reportDate", "plate", "chassisLast6", "packageName", "dealerName"]
    .every((key) => typeof report[key] === "string" && report[key].trim().length > 0);
};

export const reportQueryAdapter: ReportQueryAdapter = {
  async query(input) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10_000);

    try {
      const response = await fetch(reportQueryEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(input),
        credentials: "omit",
        signal: controller.signal,
      });

      if (response.status === 404) return { status: "NOT_FOUND" };
      if (!response.ok) return { status: "SERVICE_UNAVAILABLE" };

      const report: unknown = await response.json();
      return isVerifiedReport(report)
        ? { status: "VALID", report }
        : { status: "SERVICE_UNAVAILABLE" };
    } catch {
      return { status: "SERVICE_UNAVAILABLE" };
    } finally {
      window.clearTimeout(timeout);
    }
  },
};
