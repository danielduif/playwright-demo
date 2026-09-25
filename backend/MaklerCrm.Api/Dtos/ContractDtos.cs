namespace MaklerCrm.Api.Dtos;

public record ContractCreateRequest(
    string? Line,
    string? Insurer,
    string? PolicyNumber,
    string? StartDate,
    string? EndDate,
    decimal? AnnualPremium,
    string? PaymentMode,
    string? LicensePlate);

public record ContractUpdateRequest(
    string? Line,
    string? Insurer,
    string? PolicyNumber,
    string? StartDate,
    string? EndDate,
    decimal? AnnualPremium,
    string? PaymentMode,
    string? LicensePlate);

public record ContractDto(
    int Id,
    int CustomerId,
    string Line,
    string Insurer,
    string PolicyNumber,
    DateOnly StartDate,
    DateOnly? EndDate,
    decimal AnnualPremium,
    string PaymentMode,
    string? LicensePlate,
    string Status,
    bool IsExpiringSoon);
