using System.Globalization;
using System.Text.RegularExpressions;
using MaklerCrm.Api.Data;
using MaklerCrm.Api.Dtos;
using MaklerCrm.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MaklerCrm.Api.Validation;

public class NormalizedCustomerFields
{
    public string Salutation = "";
    public string FirstName = "";
    public string LastName = "";
    public DateOnly BirthDate;
    public string Status = "";
    public string Email = "";
    public string? Phone;
    public string Street = "";
    public string HouseNumber = "";
    public string PostalCode = "";
    public string City = "";
}

public static partial class CustomerValidator
{
    [GeneratedRegex(@"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")]
    private static partial Regex EmailRegex();

    [GeneratedRegex(@"^[0-9 +\-/()]{6,20}$")]
    private static partial Regex PhoneRegex();

    private static string Trim(string? value) => (value ?? "").Trim();

    public static async Task<(ValidationErrors Errors, NormalizedCustomerFields? Fields)> ValidateAsync(
        AppDbContext db,
        IClock clock,
        DemoDefectsOptions defects,
        string? salutation,
        string? firstName,
        string? lastName,
        string? birthDate,
        string? status,
        string? email,
        string? phone,
        string? street,
        string? houseNumber,
        string? postalCode,
        string? city,
        int? existingCustomerId)
    {
        var errors = new ValidationErrors();
        var fields = new NormalizedCustomerFields();

        // Anrede
        var salutationValue = Trim(salutation);
        if (salutationValue.Length == 0 || !Lookups.Salutations.Contains(salutationValue))
        {
            errors.Add("salutation", Messages.Required(FieldLabels.Salutation));
        }
        fields.Salutation = salutationValue;

        // Vorname
        var firstNameValue = Trim(firstName);
        if (firstNameValue.Length == 0)
        {
            errors.Add("firstName", Messages.Required(FieldLabels.FirstName));
        }
        else if (firstNameValue.Length < 2 || firstNameValue.Length > 50)
        {
            errors.Add("firstName", Messages.LengthBetween(FieldLabels.FirstName, 2, 50));
        }
        fields.FirstName = firstNameValue;

        // Nachname
        var lastNameValue = Trim(lastName);
        if (lastNameValue.Length == 0)
        {
            errors.Add("lastName", Messages.Required(FieldLabels.LastName));
        }
        else if (lastNameValue.Length < 2 || lastNameValue.Length > 50)
        {
            errors.Add("lastName", Messages.LengthBetween(FieldLabels.LastName, 2, 50));
        }
        fields.LastName = lastNameValue;

        // Geburtsdatum
        var birthDateValue = Trim(birthDate);
        if (birthDateValue.Length == 0)
        {
            errors.Add("birthDate", Messages.Required(FieldLabels.BirthDate));
        }
        else if (!DateOnly.TryParseExact(birthDateValue, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedBirthDate))
        {
            errors.Add("birthDate", Messages.BirthDateFormat);
        }
        else
        {
            fields.BirthDate = parsedBirthDate;
            var today = clock.Today;
            if (parsedBirthDate > today)
            {
                errors.Add("birthDate", Messages.BirthDateFuture);
            }
            else
            {
                var minAge = defects.AgeLimitOffByOne ? 17 : 18;
                var latestValidBirthDate = today.AddYears(-minAge);
                if (parsedBirthDate > latestValidBirthDate)
                {
                    errors.Add("birthDate", Messages.BirthDateUnderage);
                }
            }
        }

        // Status
        var statusValue = Trim(status);
        if (statusValue.Length == 0)
        {
            statusValue = Lookups.DefaultCustomerStatus;
        }
        if (!Lookups.CustomerStatuses.Contains(statusValue))
        {
            errors.Add("status", Messages.Required(FieldLabels.Status));
        }
        fields.Status = statusValue;

        // E-Mail
        var emailValue = Trim(email);
        if (emailValue.Length == 0)
        {
            errors.Add("email", Messages.Required(FieldLabels.Email));
        }
        else if (!EmailRegex().IsMatch(emailValue))
        {
            errors.Add("email", Messages.EmailInvalid);
        }
        else if (emailValue.Length > 100)
        {
            errors.Add("email", Messages.LengthMax(FieldLabels.Email, 100));
        }
        else
        {
            var duplicate = await db.Customers
                .Where(c => c.Email.ToLower() == emailValue.ToLower())
                .Where(c => existingCustomerId == null || c.Id != existingCustomerId)
                .AnyAsync();
            if (duplicate)
            {
                errors.Add("email", Messages.EmailDuplicate);
            }
        }
        fields.Email = emailValue;

        // Telefon (optional)
        var phoneValue = Trim(phone);
        if (phoneValue.Length > 0 && !PhoneRegex().IsMatch(phoneValue))
        {
            errors.Add("phone", Messages.PhoneInvalid);
        }
        fields.Phone = phoneValue.Length == 0 ? null : phoneValue;

        // Straße
        var streetValue = Trim(street);
        if (streetValue.Length == 0)
        {
            errors.Add("street", Messages.Required(FieldLabels.Street));
        }
        else if (streetValue.Length > 80)
        {
            errors.Add("street", Messages.LengthMax(FieldLabels.Street, 80));
        }
        fields.Street = streetValue;

        // Hausnummer
        var houseNumberValue = Trim(houseNumber);
        if (houseNumberValue.Length == 0)
        {
            errors.Add("houseNumber", Messages.Required(FieldLabels.HouseNumber));
        }
        else if (houseNumberValue.Length > 10)
        {
            errors.Add("houseNumber", Messages.LengthMax(FieldLabels.HouseNumber, 10));
        }
        fields.HouseNumber = houseNumberValue;

        // PLZ
        var postalCodeValue = Trim(postalCode);
        var postalCodePattern = defects.PostalCodeAllowsFourDigits ? @"^\d{4,5}$" : @"^\d{5}$";
        if (postalCodeValue.Length == 0)
        {
            errors.Add("postalCode", Messages.Required(FieldLabels.PostalCode));
        }
        else if (!Regex.IsMatch(postalCodeValue, postalCodePattern))
        {
            errors.Add("postalCode", Messages.PostalCodeInvalid);
        }
        fields.PostalCode = postalCodeValue;

        // Ort
        var cityValue = Trim(city);
        if (cityValue.Length == 0)
        {
            errors.Add("city", Messages.Required(FieldLabels.City));
        }
        else if (cityValue.Length > 50)
        {
            errors.Add("city", Messages.LengthMax(FieldLabels.City, 50));
        }
        fields.City = cityValue;

        return errors.HasErrors ? (errors, null) : (errors, fields);
    }
}
