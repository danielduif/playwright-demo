using MaklerCrm.Api.Data;
using MaklerCrm.Api.Endpoints;
using MaklerCrm.Api.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<DemoDefectsOptions>(builder.Configuration.GetSection(DemoDefectsOptions.SectionName));
builder.Services.AddSingleton<IClock, SystemClock>();

var connectionString = builder.Configuration.GetConnectionString("Default") ?? "Data Source=makler-crm.db";
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(connectionString));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "Makler-CRM API", Version = "v1" });
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var clock = scope.ServiceProvider.GetRequiredService<IClock>();
    db.Database.EnsureCreated();
    if (!db.Customers.Any())
    {
        SeedData.Apply(db, clock.Today);
    }
}

app.MapCustomerEndpoints();
app.MapContractEndpoints();
app.MapDashboardEndpoints();
app.MapLookupsEndpoints();
app.MapTestEndpoints();

app.Run();

public partial class Program;
