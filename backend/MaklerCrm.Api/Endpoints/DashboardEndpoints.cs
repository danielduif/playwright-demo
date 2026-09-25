using MaklerCrm.Api.Data;
using MaklerCrm.Api.Dtos;
using MaklerCrm.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MaklerCrm.Api.Endpoints;

public static class DashboardEndpoints
{
    public static void MapDashboardEndpoints(this WebApplication app)
    {
        app.MapGet("/api/dashboard", async (AppDbContext db, IClock clock) =>
        {
            var today = clock.Today;
            var customers = await db.Customers.Include(c => c.Contracts).ToListAsync();

            var customersTotal = customers.Count;
            var customersActive = customers.Count(c => c.Status == "Aktiv");

            var allContracts = customers.SelectMany(c => c.Contracts.Select(contract => (Customer: c, Contract: contract))).ToList();
            var activeContracts = allContracts.Where(x => ContractStatusCalculator.GetStatus(x.Contract, today) == ContractStatusCalculator.Aktiv).ToList();
            var expiringContracts = allContracts.Where(x => ContractStatusCalculator.IsExpiringSoon(x.Contract, today)).ToList();

            var dto = new DashboardDto(
                CustomersTotal: customersTotal,
                CustomersActive: customersActive,
                ContractsActive: activeContracts.Count,
                ContractsExpiring: expiringContracts.Count,
                PremiumVolume: activeContracts.Sum(x => x.Contract.AnnualPremium),
                ExpiringContracts: expiringContracts
                    .OrderBy(x => x.Contract.EndDate)
                    .Select(x => new ExpiringContractDto(
                        x.Contract.PolicyNumber,
                        x.Contract.Line,
                        x.Customer.Id,
                        x.Customer.CustomerNumber,
                        $"{x.Customer.FirstName} {x.Customer.LastName}",
                        x.Contract.EndDate!.Value))
                    .ToList());

            return Results.Ok(dto);
        });
    }
}
