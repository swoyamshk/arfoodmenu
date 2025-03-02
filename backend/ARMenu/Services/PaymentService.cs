using System.Security.Cryptography;
using System.Text;

public class PaymentService
{
    public string GenerateHmacSha256Hash(string data, string secret)
    {
        if (string.IsNullOrEmpty(data) || string.IsNullOrEmpty(secret))
        {
            throw new ArgumentException("Both data and secret are required to generate a hash.");
        }

        using (HMACSHA256 hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret)))
        {
            byte[] hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
            return Convert.ToBase64String(hashBytes);
        }
    }
}
