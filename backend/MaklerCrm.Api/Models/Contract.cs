namespace MaklerCrm.Api.Models;

public class Contract
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public Customer? Customer { get; set; }

    public required string Line { get; set; }
    public required string Insurer { get; set; }
    public required string PolicyNumber { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public decimal AnnualPremium { get; set; }
    public required string PaymentMode { get; set; }
    public string? LicensePlate { get; set; }
}
