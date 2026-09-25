namespace MaklerCrm.Api.Models;

public static class Lookups
{
    public static readonly string[] Salutations = ["Herr", "Frau", "Divers"];
    public static readonly string[] CustomerStatuses = ["Interessent", "Aktiv", "Inaktiv"];
    public static readonly string[] ContractLines =
        ["Haftpflicht", "Hausrat", "KFZ", "Rechtsschutz", "Berufsunfähigkeit", "Leben", "Wohngebäude"];
    public static readonly string[] Insurers =
        ["Nordstern Versicherung", "Hanseatische Assekuranz", "Alpen Direkt", "Rheinland Schutz"];
    public static readonly string[] PaymentModes = ["monatlich", "vierteljährlich", "halbjährlich", "jährlich"];

    public const string DefaultCustomerStatus = "Interessent";
}

public static class ContractStatusCalculator
{
    public const string Geplant = "Geplant";
    public const string Aktiv = "Aktiv";
    public const string Abgelaufen = "Abgelaufen";

    public static string GetStatus(Contract contract, DateOnly today)
    {
        if (contract.StartDate > today)
        {
            return Geplant;
        }

        if (contract.EndDate.HasValue && contract.EndDate.Value < today)
        {
            return Abgelaufen;
        }

        return Aktiv;
    }

    public static bool IsExpiringSoon(Contract contract, DateOnly today)
    {
        return GetStatus(contract, today) == Aktiv
            && contract.EndDate.HasValue
            && contract.EndDate.Value <= today.AddDays(60);
    }
}
