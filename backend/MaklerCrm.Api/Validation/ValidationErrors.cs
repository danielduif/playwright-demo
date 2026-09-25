namespace MaklerCrm.Api.Validation;

/// <summary>
/// Sammelt Feldfehler. Pro Feld wird nur die zuerst hinzugefügte Meldung behalten,
/// damit die Prüfreihenfolge (Pflicht, Format, Länge, Eindeutigkeit) automatisch die
/// Priorität aus der Spezifikation abbildet.
/// </summary>
public class ValidationErrors
{
    private readonly Dictionary<string, string> _errors = new();

    public bool HasErrors => _errors.Count > 0;

    public void Add(string field, string message)
    {
        _errors.TryAdd(field, message);
    }

    public bool Has(string field) => _errors.ContainsKey(field);

    public IReadOnlyDictionary<string, string[]> ToErrorDictionary() =>
        _errors.ToDictionary(kv => kv.Key, kv => new[] { kv.Value });
}
