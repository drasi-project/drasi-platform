namespace Drasi.Source.SDK;

public class Reactivator
{
    public static string SourceId()
    {
        return Environment.GetEnvironmentVariable("SOURCE_ID");
    }
}