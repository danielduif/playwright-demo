using MaklerCrm.Api.Data;
using MaklerCrm.Api.Models;

namespace MaklerCrm.Api.Endpoints;

public static class TestEndpoints
{
    public static void MapTestEndpoints(this WebApplication app)
    {
        if (!app.Environment.IsDevelopment())
        {
            return;
        }

        app.MapPost("/api/test/reset", (AppDbContext db, IClock clock) =>
        {
            SeedData.Apply(db, clock.Today);
            return Results.NoContent();
        });
    }
}
