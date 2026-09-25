namespace MaklerCrm.Api.Models;

public class Customer
{
    public int Id { get; set; }
    public required string CustomerNumber { get; set; }
    public required string Salutation { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public DateOnly BirthDate { get; set; }
    public required string Status { get; set; }
    public required string Email { get; set; }
    public string? Phone { get; set; }
    public required string Street { get; set; }
    public required string HouseNumber { get; set; }
    public required string PostalCode { get; set; }
    public required string City { get; set; }

    public List<Contract> Contracts { get; set; } = [];
}
