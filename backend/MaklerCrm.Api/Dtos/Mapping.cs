using MaklerCrm.Api.Models;

namespace MaklerCrm.Api.Dtos;

public static class Mapping
{
    public static CustomerListItemDto ToListItem(Customer c) => new(
        c.Id, c.CustomerNumber, c.FirstName, c.LastName, c.City, c.Status, c.Contracts.Count);

    public static CustomerDetailDto ToDetail(Customer c, DateOnly today) => new(
        c.Id, c.CustomerNumber, c.Salutation, c.FirstName, c.LastName, c.BirthDate, c.Status,
        c.Email, c.Phone, c.Street, c.HouseNumber, c.PostalCode, c.City,
        c.Contracts.Select(contract => ToContractDto(contract, today)).OrderBy(x => x.PolicyNumber).ToList());

    public static ContractDto ToContractDto(Contract contract, DateOnly today)
    {
        var status = ContractStatusCalculator.GetStatus(contract, today);
        var expiringSoon = ContractStatusCalculator.IsExpiringSoon(contract, today);
        return new ContractDto(
            contract.Id, contract.CustomerId, contract.Line, contract.Insurer, contract.PolicyNumber,
            contract.StartDate, contract.EndDate, contract.AnnualPremium, contract.PaymentMode,
            contract.LicensePlate, status, expiringSoon);
    }
}
