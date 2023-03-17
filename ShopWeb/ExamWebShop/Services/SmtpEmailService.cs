using ExamWebShop.Interfaces;
using ExamWebShop.Models.Account;
using MailKit.Net.Smtp;
using MimeKit;

namespace ExamWebShop.Services
{
    public class SmtpEmailService : ISmtpEmailService
    {
        private readonly EmailConfiguration _configuration;
        public SmtpEmailService()
        {
            _configuration = new EmailConfiguration()
            {
                From = "oleksandr.burda@ukr.net",
                SmtpServer = "smtp.ukr.net",
                Port = 2525,
                UserName = "oleksandr.burda@ukr.net",
                Password = "gDdNF05EpRg78zEX"
            };
        }

        public void Send(Message message)
        {
            var builder = new BodyBuilder();
            builder.HtmlBody = message.Body;

            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(_configuration.From, _configuration.From));
            emailMessage.To.Add(new MailboxAddress(message.To, message.To));
            emailMessage.Subject = message.Subject;
            emailMessage.Body = builder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                try
                {
                    client.Connect(_configuration.SmtpServer, _configuration.Port, true);
                    client.Authenticate(_configuration.UserName, _configuration.Password);
                    client.Send(emailMessage);
                }
                catch (Exception ex)
                {
                    System.Console.WriteLine("Send message error {0}", ex.Message);
                }
                finally
                {
                    client.Disconnect(true);
                    client.Dispose();
                }
            }
        }
    }
}
