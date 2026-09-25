using Microsoft.EntityFrameworkCore;

namespace MaklerCrm.Api.Data;

public static class CustomerNumberGenerator
{
    public static async Task<string> NextAsync(AppDbContext db)
    {
        var numbers = await db.Customers.Select(c => c.CustomerNumber).ToListAsync();
        var maxSuffix = 10000;
        foreach (var number in numbers)
        {
            if (number.StartsWith("K-") && int.TryParse(number.AsSpan(2), out var suffix) && suffix > maxSuffix)
            {
                maxSuffix = suffix;
            }
        }
        return $"K-{maxSuffix + 1}";
    }
}
