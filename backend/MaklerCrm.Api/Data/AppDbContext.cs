using MaklerCrm.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MaklerCrm.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Contract> Contracts => Set<Contract>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasIndex(c => c.CustomerNumber).IsUnique();
            entity.HasIndex(c => c.Email).IsUnique();
        });

        modelBuilder.Entity<Contract>(entity =>
        {
            entity.HasIndex(c => c.PolicyNumber).IsUnique();
            entity.Property(c => c.AnnualPremium).HasColumnType("decimal(18,2)");
            entity.HasOne(c => c.Customer)
                .WithMany(cust => cust.Contracts)
                .HasForeignKey(c => c.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
