using ExamWebShop.Models.Account;

namespace ExamWebShop.Interfaces
{
    public interface ISmtpEmailService
    {
        void Send(Message message);
    }
}
