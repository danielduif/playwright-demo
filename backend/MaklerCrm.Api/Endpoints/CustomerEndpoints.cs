using MaklerCrm.Api.Data;
using MaklerCrm.Api.Dtos;
using MaklerCrm.Api.Models;
using MaklerCrm.Api.Validation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace MaklerCrm.Api.Endpoints;

public static class CustomerEndpoints
{
    public static void MapCustomerEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/customers");

        group.MapGet("", async (AppDbContext db, string? search, string? status) =>
        {
            var query = db.Customers.Include(c => c.Contracts).AsQueryable();

            if (!string.IsNullOrWhiteSpace(status) && status != "Alle")
            {
                query = query.Where(c => c.Status == status);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(c =>
                    c.CustomerNumber.ToLower().Contains(term) ||
                    c.FirstName.ToLower().Contains(term) ||
                    c.LastName.ToLower().Contains(term) ||
                    c.Email.ToLower().Contains(term));
            }

            var customers = await query.OrderBy(c => c.LastName).ToListAsync();
            return Results.Ok(customers.Select(Mapping.ToListItem));
        });

        group.MapGet("/{id:int}", async (AppDbContext db, IClock clock, int id) =>
        {
            var customer = await db.Customers.Include(c => c.Contracts).FirstOrDefaultAsync(c => c.Id == id);
            if (customer is null)
            {
                return Results.NotFound(new { message = Messages.CustomerNotFound });
            }
            return Results.Ok(Mapping.ToDetail(customer, clock.Today));
        });

        group.MapPost("", async (AppDbContext db, IClock clock, IOptionsMonitor<DemoDefectsOptions> defectsOptions, CustomerCreateRequest req) =>
        {
            var defects = defectsOptions.CurrentValue;
            var (errors, fields) = await CustomerValidator.ValidateAsync(
                db, clock, defects,
                req.Salutation, req.FirstName, req.LastName, req.BirthDate, req.Status,
                req.Email, req.Phone, req.Street, req.HouseNumber, req.PostalCode, req.City,
                existingCustomerId: null);

            if (fields is null)
            {
                return Results.ValidationProblem(errors.ToErrorDictionary());
            }

            var customer = new Customer
            {
                CustomerNumber = await CustomerNumberGenerator.NextAsync(db),
                Salutation = fields.Salutation,
                FirstName = fields.FirstName,
                LastName = fields.LastName,
                BirthDate = fields.BirthDate,
                Status = fields.Status,
                Email = fields.Email,
                Phone = fields.Phone,
                Street = fields.Street,
                HouseNumber = fields.HouseNumber,
                PostalCode = fields.PostalCode,
                City = fields.City,
            };
            db.Customers.Add(customer);
            await db.SaveChangesAsync();

            return Results.Ok(Mapping.ToDetail(customer, clock.Today));
        });

        group.MapPut("/{id:int}/master-data", async (AppDbContext db, IClock clock, IOptionsMonitor<DemoDefectsOptions> defectsOptions, int id, CustomerMasterDataUpdateRequest req) =>
        {
            var customer = await db.Customers.Include(c => c.Contracts).FirstOrDefaultAsync(c => c.Id == id);
            if (customer is null)
            {
                return Results.NotFound(new { message = Messages.CustomerNotFound });
            }

            var defects = defectsOptions.CurrentValue;
            var (errors, fields) = await CustomerValidator.ValidateAsync(
                db, clock, defects,
                req.Salutation, req.FirstName, req.LastName, req.BirthDate, req.Status,
                customer.Email, customer.Phone, customer.Street, customer.HouseNumber, customer.PostalCode, customer.City,
                existingCustomerId: id);

            if (fields is null)
            {
                return Results.ValidationProblem(errors.ToErrorDictionary());
            }

            customer.Salutation = fields.Salutation;
            customer.FirstName = fields.FirstName;
            customer.LastName = fields.LastName;
            customer.BirthDate = fields.BirthDate;
            customer.Status = fields.Status;
            await db.SaveChangesAsync();

            return Results.Ok(Mapping.ToDetail(customer, clock.Today));
        });

        group.MapPut("/{id:int}/contact", async (AppDbContext db, IClock clock, IOptionsMonitor<DemoDefectsOptions> defectsOptions, int id, CustomerContactUpdateRequest req) =>
        {
            var customer = await db.Customers.Include(c => c.Contracts).FirstOrDefaultAsync(c => c.Id == id);
            if (customer is null)
            {
                return Results.NotFound(new { message = Messages.CustomerNotFound });
            }

            var defects = defectsOptions.CurrentValue;
            var (errors, fields) = await CustomerValidator.ValidateAsync(
                db, clock, defects,
                customer.Salutation, customer.FirstName, customer.LastName,
                customer.BirthDate.ToString("yyyy-MM-dd"), customer.Status,
                req.Email, req.Phone, req.Street, req.HouseNumber, req.PostalCode, req.City,
                existingCustomerId: id);

            if (fields is null)
            {
                return Results.ValidationProblem(errors.ToErrorDictionary());
            }

            customer.Email = fields.Email;
            customer.Phone = fields.Phone;
            customer.Street = fields.Street;
            customer.HouseNumber = fields.HouseNumber;
            customer.PostalCode = fields.PostalCode;
            customer.City = fields.City;
            await db.SaveChangesAsync();

            return Results.Ok(Mapping.ToDetail(customer, clock.Today));
        });

        group.MapDelete("/{id:int}", async (AppDbContext db, IOptionsMonitor<DemoDefectsOptions> defectsOptions, int id) =>
        {
            var customer = await db.Customers.Include(c => c.Contracts).FirstOrDefaultAsync(c => c.Id == id);
            if (customer is null)
            {
                return Results.NotFound(new { message = Messages.CustomerNotFound });
            }

            var defects = defectsOptions.CurrentValue;
            if (customer.Contracts.Count > 0 && !defects.DeleteIgnoresContracts)
            {
                return Results.Conflict(new { message = Messages.CustomerHasContracts });
            }

            db.Customers.Remove(customer);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }
}
