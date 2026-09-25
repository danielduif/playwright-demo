using System.Globalization;
using System.Text.RegularExpressions;
using MaklerCrm.Api.Data;
using MaklerCrm.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MaklerCrm.Api.Validation;

public class NormalizedContractFields
{
    public string Line = "";
    public string Insurer = "";
    public string PolicyNumber = "";
    public DateOnly StartDate;
    public DateOnly? EndDate;
    public decimal AnnualPremium;
    public string PaymentMode = "";
    public string? LicensePlate;
}

public static partial class ContractValidator
{
    [GeneratedRegex(@"^[A-Z]{3}-\d{6}$")]
    private static partial Regex PolicyNumberRegex();

    [GeneratedRegex(@"^[A-Z]{1,3}-[A-Z]{1,2} \d{1,4}$")]
    private static partial Regex LicensePlateRegex();

    private static string Trim(string? value) => (value ?? "").Trim();

    public static async Task<(ValidationErrors Errors, NormalizedContractFields? Fields)> ValidateAsync(
        AppDbContext db,
        IClock clock,
        DemoDefectsOptions defects,
        string? line,
        string? insurer,
        string? policyNumber,
        string? startDate,
        string? endDate,
        decimal? annualPremium,
        string? paymentMode,
        string? licensePlate,
        int? existingContractId)
    {
        var errors = new ValidationErrors();
        var fields = new NormalizedContractFields();

        // Sparte
        var lineValue = Trim(line);
        if (lineValue.Length == 0 || !Lookups.ContractLines.Contains(lineValue))
        {
            errors.Add("line", Messages.Required(FieldLabels.Line));
        }
        fields.Line = lineValue;

        // Versicherer
        var insurerValue = Trim(insurer);
        if (insurerValue.Length == 0 || !Lookups.Insurers.Contains(insurerValue))
        {
            errors.Add("insurer", Messages.Required(FieldLabels.Insurer));
        }
        fields.Insurer = insurerValue;

        // Policennummer
        var policyNumberValue = Trim(policyNumber);
        if (policyNumberValue.Length == 0)
        {
            errors.Add("policyNumber", Messages.Required(FieldLabels.PolicyNumber));
        }
        else if (!PolicyNumberRegex().IsMatch(policyNumberValue))
        {
            errors.Add("policyNumber", Messages.PolicyNumberFormat);
        }
        else
        {
            var duplicate = await db.Contracts
                .Where(c => c.PolicyNumber == policyNumberValue)
                .Where(c => existingContractId == null || c.Id != existingContractId)
                .AnyAsync();
            if (duplicate)
            {
                errors.Add("policyNumber", Messages.PolicyNumberDuplicate);
            }
        }
        fields.PolicyNumber = policyNumberValue;

        // Vertragsbeginn
        var startDateValue = Trim(startDate);
        DateOnly? parsedStartDate = null;
        if (startDateValue.Length == 0)
        {
            errors.Add("startDate", Messages.Required(FieldLabels.StartDate));
        }
        else if (!DateOnly.TryParseExact(startDateValue, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedStart))
        {
            errors.Add("startDate", Messages.ContractStartDateFormat);
        }
        else
        {
            parsedStartDate = parsedStart;
            fields.StartDate = parsedStart;
        }

        // Vertragsende (optional)
        var endDateValue = Trim(endDate);
        DateOnly? parsedEndDate = null;
        if (endDateValue.Length > 0)
        {
            if (!DateOnly.TryParseExact(endDateValue, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedEnd))
            {
                errors.Add("endDate", Messages.ContractEndDateFormat);
            }
            else
            {
                parsedEndDate = parsedEnd;
                fields.EndDate = parsedEnd;
            }
        }

        if (parsedStartDate.HasValue && parsedEndDate.HasValue)
        {
            var endMustBeAfterStart = !defects.EndDateMayEqualStartDate;
            var isInvalid = endMustBeAfterStart
                ? parsedEndDate.Value <= parsedStartDate.Value
                : parsedEndDate.Value < parsedStartDate.Value;
            if (isInvalid)
            {
                errors.Add("endDate", Messages.EndNotAfterStart);
            }
        }

        // Jahresbeitrag
        if (annualPremium is null)
        {
            errors.Add("annualPremium", Messages.Required(FieldLabels.AnnualPremium));
        }
        else if (annualPremium < 0.01m || annualPremium > 99999.99m || Math.Round(annualPremium.Value, 2) != annualPremium.Value)
        {
            errors.Add("annualPremium", Messages.AnnualPremiumInvalid);
        }
        fields.AnnualPremium = annualPremium ?? 0m;

        // Zahlweise
        var paymentModeValue = Trim(paymentMode);
        if (paymentModeValue.Length == 0 || !Lookups.PaymentModes.Contains(paymentModeValue))
        {
            errors.Add("paymentMode", Messages.Required(FieldLabels.PaymentMode));
        }
        fields.PaymentMode = paymentModeValue;

        // Amtliches Kennzeichen (nur bei KFZ)
        var licensePlateValue = Trim(licensePlate);
        if (lineValue == "KFZ")
        {
            if (licensePlateValue.Length == 0)
            {
                errors.Add("licensePlate", Messages.LicensePlateRequired);
            }
            else if (!LicensePlateRegex().IsMatch(licensePlateValue))
            {
                errors.Add("licensePlate", Messages.LicensePlateFormat);
            }
            fields.LicensePlate = licensePlateValue.Length == 0 ? null : licensePlateValue;
        }
        else
        {
            fields.LicensePlate = null;
        }

        return errors.HasErrors ? (errors, null) : (errors, fields);
    }
}
