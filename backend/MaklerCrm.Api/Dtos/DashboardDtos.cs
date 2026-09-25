namespace MaklerCrm.Api.Dtos;

public record DashboardDto(
    int CustomersTotal,
    int CustomersActive,
    int ContractsActive,
    int ContractsExpiring,
    decimal PremiumVolume,
    List<ExpiringContractDto> ExpiringContracts);

public record ExpiringContractDto(
    string PolicyNumber,
    string Line,
    int CustomerId,
    string CustomerNumber,
    string CustomerName,
    DateOnly EndDate);

public record LookupsDto(
    string[] Salutations,
    string[] CustomerStatuses,
    string[] ContractLines,
    string[] Insurers,
    string[] PaymentModes,
    Dictionary<string, bool> DemoDefects);
