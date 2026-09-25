namespace MaklerCrm.Api.Models;

public class DemoDefectsOptions
{
    public const string SectionName = "DemoDefects";

    public bool AgeLimitOffByOne { get; set; }
    public bool PostalCodeAllowsFourDigits { get; set; }
    public bool EndDateMayEqualStartDate { get; set; }
    public bool DeleteIgnoresContracts { get; set; }
}
