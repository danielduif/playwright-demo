using MaklerCrm.Api.Models;

namespace MaklerCrm.Api.Data;

public static class SeedData
{
    public static void Apply(AppDbContext db, DateOnly today)
    {
        db.Contracts.RemoveRange(db.Contracts);
        db.Customers.RemoveRange(db.Customers);
        db.SaveChanges();

        var berger = new Customer
        {
            CustomerNumber = "K-10001",
            Salutation = "Herr",
            FirstName = "Thomas",
            LastName = "Berger",
            BirthDate = new DateOnly(1978, 5, 12),
            Status = "Aktiv",
            Email = "thomas.berger@example.com",
            Phone = "+49 40 1234567",
            Street = "Elbchaussee",
            HouseNumber = "12",
            PostalCode = "22763",
            City = "Hamburg",
        };
        var koehler = new Customer
        {
            CustomerNumber = "K-10002",
            Salutation = "Frau",
            FirstName = "Sabine",
            LastName = "Köhler",
            BirthDate = new DateOnly(1985, 11, 3),
            Status = "Aktiv",
            Email = "sabine.koehler@example.com",
            Phone = "+49 40 7654321",
            Street = "Lange Reihe",
            HouseNumber = "45",
            PostalCode = "20099",
            City = "Hamburg",
        };
        var yilmaz = new Customer
        {
            CustomerNumber = "K-10003",
            Salutation = "Herr",
            FirstName = "Murat",
            LastName = "Yilmaz",
            BirthDate = new DateOnly(1990, 8, 21),
            Status = "Interessent",
            Email = "murat.yilmaz@example.com",
            Phone = null,
            Street = "Bahnhofstraße",
            HouseNumber = "8",
            PostalCode = "28195",
            City = "Bremen",
        };
        var weber = new Customer
        {
            CustomerNumber = "K-10004",
            Salutation = "Frau",
            FirstName = "Anna",
            LastName = "Weber",
            BirthDate = new DateOnly(1965, 1, 30),
            Status = "Aktiv",
            Email = "anna.weber@example.com",
            Phone = "+49 511 998877",
            Street = "Marktplatz",
            HouseNumber = "3",
            PostalCode = "30159",
            City = "Hannover",
        };
        var lindner = new Customer
        {
            CustomerNumber = "K-10005",
            Salutation = "Herr",
            FirstName = "Klaus",
            LastName = "Lindner",
            BirthDate = new DateOnly(1958, 9, 9),
            Status = "Inaktiv",
            Email = "klaus.lindner@example.com",
            Phone = null,
            Street = "Gartenweg",
            HouseNumber = "21",
            PostalCode = "24103",
            City = "Kiel",
        };
        var schneider = new Customer
        {
            CustomerNumber = "K-10006",
            Salutation = "Frau",
            FirstName = "Mira",
            LastName = "Schneider",
            BirthDate = new DateOnly(1995, 2, 17),
            Status = "Interessent",
            Email = "mira.schneider@example.com",
            Phone = "+49 69 445566",
            Street = "Kaiserstraße",
            HouseNumber = "77",
            PostalCode = "60329",
            City = "Frankfurt am Main",
        };

        db.Customers.AddRange(berger, koehler, yilmaz, weber, lindner, schneider);
        db.SaveChanges();

        db.Contracts.AddRange(
            new Contract
            {
                CustomerId = berger.Id,
                Line = "Haftpflicht",
                Insurer = "Nordstern Versicherung",
                PolicyNumber = "HPF-100001",
                StartDate = today.AddYears(-3),
                EndDate = null,
                AnnualPremium = 84.00m,
                PaymentMode = "jährlich",
            },
            new Contract
            {
                CustomerId = berger.Id,
                Line = "Hausrat",
                Insurer = "Hanseatische Assekuranz",
                PolicyNumber = "HRT-100002",
                StartDate = today.AddYears(-2),
                EndDate = today.AddDays(30),
                AnnualPremium = 156.50m,
                PaymentMode = "jährlich",
            },
            new Contract
            {
                CustomerId = koehler.Id,
                Line = "KFZ",
                Insurer = "Alpen Direkt",
                PolicyNumber = "KFZ-100003",
                StartDate = today.AddYears(-1),
                EndDate = null,
                AnnualPremium = 612.00m,
                PaymentMode = "vierteljährlich",
                LicensePlate = "HH-SK 4711",
            },
            new Contract
            {
                CustomerId = koehler.Id,
                Line = "Rechtsschutz",
                Insurer = "Rheinland Schutz",
                PolicyNumber = "RSV-100004",
                StartDate = today.AddYears(-5),
                EndDate = today.AddDays(45),
                AnnualPremium = 289.90m,
                PaymentMode = "halbjährlich",
            },
            new Contract
            {
                CustomerId = weber.Id,
                Line = "Berufsunfähigkeit",
                Insurer = "Nordstern Versicherung",
                PolicyNumber = "BUV-100005",
                StartDate = today.AddYears(-4),
                EndDate = null,
                AnnualPremium = 1248.00m,
                PaymentMode = "monatlich",
            },
            new Contract
            {
                CustomerId = weber.Id,
                Line = "Leben",
                Insurer = "Hanseatische Assekuranz",
                PolicyNumber = "LEB-100006",
                StartDate = today.AddDays(15),
                EndDate = null,
                AnnualPremium = 960.00m,
                PaymentMode = "monatlich",
            },
            new Contract
            {
                CustomerId = lindner.Id,
                Line = "Haftpflicht",
                Insurer = "Alpen Direkt",
                PolicyNumber = "HPF-100007",
                StartDate = today.AddYears(-6),
                EndDate = today.AddDays(-10),
                AnnualPremium = 72.00m,
                PaymentMode = "jährlich",
            });

        db.SaveChanges();
    }
}
