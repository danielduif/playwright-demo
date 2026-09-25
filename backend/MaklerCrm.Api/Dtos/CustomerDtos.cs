namespace MaklerCrm.Api.Dtos;

public record CustomerCreateRequest(
    string? Salutation,
    string? FirstName,
    string? LastName,
    string? BirthDate,
    string? Status,
    string? Email,
    string? Phone,
    string? Street,
    string? HouseNumber,
    string? PostalCode,
    string? City);

public record CustomerMasterDataUpdateRequest(
    string? Salutation,
    string? FirstName,
    string? LastName,
    string? BirthDate,
    string? Status);

public record CustomerContactUpdateRequest(
    string? Email,
    string? Phone,
    string? Street,
    string? HouseNumber,
    string? PostalCode,
    string? City);

public record CustomerListItemDto(
    int Id,
    string CustomerNumber,
    string FirstName,
    string LastName,
    string City,
    string Status,
    int ContractsCount);

public record CustomerDetailDto(
    int Id,
    string CustomerNumber,
    string Salutation,
    string FirstName,
    string LastName,
    DateOnly BirthDate,
    string Status,
    string Email,
    string? Phone,
    string Street,
    string HouseNumber,
    string PostalCode,
    string City,
    List<ContractDto> Contracts);
