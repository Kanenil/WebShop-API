namespace ExamWebShop.Models.Account
{
    public class EmailConfiguration
    {
        //Хто надсилає лист - від кого буде лист
        public string From { get; set; }
        /// <summary>
        /// Адерса сервера
        /// </summary>
        public string SmtpServer { get; set; }
        /// <summary>
        /// Який порт даного сервера
        /// </summary>
        public int Port { get; set; }
        /// <summary>
        /// Імя користувача- логін
        /// </summary>
        public string UserName { get; set; }
        /// <summary>
        /// Пароль
        /// </summary>
        public string Password { get; set; }
    }
}
