using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace ARMenu.Services
{
    public class EmailService : IEmailService
    {
        private readonly string _smtpHost = "smtp.gmail.com";  // Update with your SMTP host
        private readonly int _smtpPort = 587;  // You may need to adjust based on your provider (e.g., 465 or 25)
        private readonly string _smtpUsername = "xmarketingblogx@gmail.com"; // Your SMTP email
        private readonly string _smtpPassword = "pfammqherpbdvrha";    // Your SMTP password

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            if (string.IsNullOrEmpty(toEmail))
            {
                throw new ArgumentNullException(nameof(toEmail), "Email address cannot be null or empty.");
            }

            try
            {
                // Log email details to ensure the email value is correct
                Console.WriteLine($"Sending email to: {toEmail}");
                Console.WriteLine($"Subject: {subject}");
                Console.WriteLine($"Body: {body}");

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_smtpUsername),  // Use your SMTP email address
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true // Allow HTML content in the body
                };
                mailMessage.To.Add(toEmail);

                using (var smtpClient = new SmtpClient(_smtpHost, _smtpPort))
                {
                    smtpClient.Credentials = new NetworkCredential(_smtpUsername, _smtpPassword);
                    smtpClient.EnableSsl = true; // Enable SSL for security
                    await smtpClient.SendMailAsync(mailMessage);
                }

                Console.WriteLine("Email sent successfully.");
            }
            catch (Exception ex)
            {
                // Log the exception for debugging purposes
                Console.WriteLine($"Error sending email: {ex.Message}");
                throw;  // Rethrow the exception after logging it
            }
        }
    }
}
