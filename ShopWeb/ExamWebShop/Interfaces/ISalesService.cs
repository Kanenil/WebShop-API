using ExamWebShop.Data.Entities;
using ExamWebShop.Models.Sales;

namespace ExamWebShop.Interfaces
{
    public interface ISalesService
    {
        IQueryable<SaleEntity> Sales { get; }
        IQueryable<SaleProductEntity> SaleProducts { get; }
        Task<int> Create(SaleCreateViewModel model);
        Task AddToSale(ProductSaleViewModel model);
        Task RemoveSale(ProductSaleViewModel model);
        Task Update(SaleEditViewModel model);
        Task<bool> Delete(int id);
    }
}
