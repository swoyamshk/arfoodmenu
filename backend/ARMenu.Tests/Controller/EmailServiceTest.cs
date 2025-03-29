using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using ARMenu.Services;
using Moq;
using Xunit;

namespace ARMenu.Tests
{
    public class EmailServiceTests
    {
        [Fact]
        public async Task SendEmailAsync_ValidEmail_SendsEmailSuccessfully()
        {
            var emailService = new EmailService();
            var toEmail = "test@example.com";
            var subject = "Test Subject";
            var body = "Test Body";

            var exception = await Record.ExceptionAsync(() => emailService.SendEmailAsync(toEmail, subject, body));

            Assert.Null(exception); // Ensure no exceptions are thrown
        }

        [Fact]
        public async Task SendEmailAsync_NullOrEmptyEmail_ThrowsArgumentNullException()
        {
            // Arrange
            var emailService = new EmailService();

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentNullException>(() => emailService.SendEmailAsync("", "Subject", "Body"));
        }
    }
}
