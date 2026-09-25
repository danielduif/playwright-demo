using MaklerCrm.Api.Data;
using MaklerCrm.Api.Dtos;
using MaklerCrm.Api.Models;
using MaklerCrm.Api.Validation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace MaklerCrm.Api.Endpoints;

public static class ContractEndpoints
{
    public static void MapContractEndpoints(this WebApplication app)
    {
        app.MapPost("/api/customers/{customerId:int}/contracts", async (
            AppDbContext db, IClock clock, IOptionsMonitor<DemoDefectsOptions> defectsOptions, int customerId, ContractCreateRequest req) =>
        {
            var customer = await db.Customers.FirstOrDefaultAsync(c => c.Id == customerId);
            if (customer is null)
            {
                return Results.NotFound(new { message = Messages.CustomerNotFound });
            }

            var defects = defectsOptions.CurrentValue;
            var (errors, fields) = await ContractValidator.ValidateAsync(
                db, clock, defects,
                req.Line, req.Insurer, req.PolicyNumber, req.StartDate, req.EndDate,
                req.AnnualPremium, req.PaymentMode, req.LicensePlate,
                existingContractId: null);

            if (fields is null)
            {
                return Results.ValidationProblem(errors.ToErrorDictionary());
            }

            var contract = new Contract
            {
                CustomerId = customerId,
                Line = fields.Line,
                Insurer = fields.Insurer,
                PolicyNumber = fields.PolicyNumber,
                StartDate = fields.StartDate,
                EndDate = fields.EndDate,
                AnnualPremium = fields.AnnualPremium,
                PaymentMode = fields.PaymentMode,
                LicensePlate = fields.LicensePlate,
            };
            db.Contracts.Add(contract);
            await db.SaveChangesAsync();

            return Results.Ok(Mapping.ToContractDto(contract, clock.Today));
        });

        app.MapPut("/api/contracts/{id:int}", async (
            AppDbContext db, IClock clock, IOptionsMonitor<DemoDefectsOptions> defectsOptions, int id, ContractUpdateRequest req) =>
        {
            var contract = await db.Contracts.FirstOrDefaultAsync(c => c.Id == id);
            if (contract is null)
            {
                return Results.NotFound(new { message = "Vertrag nicht gefunden." });
            }

            var defects = defectsOptions.CurrentValue;
            var (errors, fields) = await ContractValidator.ValidateAsync(
                db, clock, defects,
                req.Line, req.Insurer, req.PolicyNumber, req.StartDate, req.EndDate,
                req.AnnualPremium, req.PaymentMode, req.LicensePlate,
                existingContractId: id);

            if (fields is null)
            {
                return Results.ValidationProblem(errors.ToErrorDictionary());
            }

            contract.Line = fields.Line;
            contract.Insurer = fields.Insurer;
            contract.PolicyNumber = fields.PolicyNumber;
            contract.StartDate = fields.StartDate;
            contract.EndDate = fields.EndDate;
            contract.AnnualPremium = fields.AnnualPremium;
            contract.PaymentMode = fields.PaymentMode;
            contract.LicensePlate = fields.LicensePlate;
            await db.SaveChangesAsync();

            return Results.Ok(Mapping.ToContractDto(contract, clock.Today));
        });

        app.MapDelete("/api/contracts/{id:int}", async (AppDbContext db, int id) =>
        {
            var contract = await db.Contracts.FirstOrDefaultAsync(c => c.Id == id);
            if (contract is null)
            {
                return Results.NotFound(new { message = "Vertrag nicht gefunden." });
            }

            db.Contracts.Remove(contract);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }
}
