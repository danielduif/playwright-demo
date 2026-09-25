using MaklerCrm.Api.Dtos;
using MaklerCrm.Api.Models;
using Microsoft.Extensions.Options;

namespace MaklerCrm.Api.Endpoints;

public static class LookupsEndpoints
{
    public static void MapLookupsEndpoints(this WebApplication app)
    {
        app.MapGet("/api/lookups", (IOptionsMonitor<DemoDefectsOptions> defectsOptions) =>
        {
            var defects = defectsOptions.CurrentValue;
            var dto = new LookupsDto(
                Lookups.Salutations,
                Lookups.CustomerStatuses,
                Lookups.ContractLines,
                Lookups.Insurers,
                Lookups.PaymentModes,
                new Dictionary<string, bool>
                {
                    ["ageLimitOffByOne"] = defects.AgeLimitOffByOne,
                    ["postalCodeAllowsFourDigits"] = defects.PostalCodeAllowsFourDigits,
                    ["endDateMayEqualStartDate"] = defects.EndDateMayEqualStartDate,
                    ["deleteIgnoresContracts"] = defects.DeleteIgnoresContracts,
                });
            return Results.Ok(dto);
        });
    }
}
