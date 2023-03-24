namespace ExamWebShop.Constants
{
    public static class OrderStatuses
    {
        public static List<string> All = new()
        {
            New,
            InProcess,
            Deliver,
            Success,
            Canceled
        };
        public const string New = "Нове замовлення";
        public const string InProcess = "Обробляється";
        public const string Deliver = "Прямує до міста отримувача";
        public const string Success = "Знаходиться в місті отримувача";
        public const string Canceled = "Скасовано";
    }
}
