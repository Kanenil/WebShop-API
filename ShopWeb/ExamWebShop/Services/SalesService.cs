using AutoMapper;
using ExamWebShop.Data;
using ExamWebShop.Data.Entities;
using ExamWebShop.Helpers;
using ExamWebShop.Interfaces;
using ExamWebShop.Models.Sales;

namespace ExamWebShop.Services
{
    public class SalesService : ISalesService
    {
        private readonly AppEFContext _context;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        public SalesService(AppEFContext context, IConfiguration configuration, IMapper mapper)
        {
            _context = context;
            _configuration = configuration;
            _mapper = mapper;
        }

        public IQueryable<SaleEntity> Sales => _context.Sales;

        public IQueryable<SaleProductEntity> SaleProducts => _context.SaleProducts;

        public async Task AddToSale(ProductSaleViewModel model)
        {
            var data = _context.SaleProducts.SingleOrDefault(x => x.ProductId == model.Product && x.SaleId == model.Sale);

            if(model.Product == 0 || data != null || model.Sale == 0)
                throw new Exception("Parameters in 'model.Product' can not be 0!");

            _context.Add(new SaleProductEntity()
            {
                SaleId = model.Sale,
                ProductId = model.Product
            });
            await _context.SaveChangesAsync();
            
        }

        public async Task RemoveSale(ProductSaleViewModel model)
        {
            var data = _context.SaleProducts.SingleOrDefault(x => x.ProductId == model.Product && x.SaleId == model.Sale);

            if (data == null)
                throw new Exception("Parameters in 'model.Product' can not be 0!");

            _context.Remove(data);
            await _context.SaveChangesAsync();
        }


        public async Task<int> Create(SaleCreateViewModel model)
        {
            if (model != null)
            {
                var entity = _mapper.Map<SaleEntity>(model);
                _context.Sales.Add(entity);
                await _context.SaveChangesAsync();
                return entity.Id;
            }
            throw new Exception("Parameter 'model' can not be null!");
        }

        public async Task<bool> Delete(int id)
        {
            var entity = _context.Sales.SingleOrDefault(x => x.Id == id);
            if (entity != null)
            {
                var data = _context.Sales.SingleOrDefault(p => p.Id == entity.Id);
                data.IsDeleted = true;
                await _context.SaveChangesAsync();
                return data.IsDeleted;
            }
            throw new Exception("In 'id' found 0 entities!");
        }

        
        public async Task Update(SaleEditViewModel model)
        {
            if (model == null)
                throw new Exception("Parameter 'model' can not be null!");

            var data = _context.Sales.SingleOrDefault(x => x.Id == model.Id);

            if (!String.IsNullOrEmpty(data.Image) && data.Image != model.Image)
                ImageWorker.DeleteAllImages(data.Image, _configuration);

            data.Image = model.Image;
            data.Name = model.Name;
            data.Description = model.Description;
            data.DecreasePercent = model.DecreasePercent;
            data.ExpireTime = DateTime.SpecifyKind(model.ExpireTime, DateTimeKind.Utc);
            await _context.SaveChangesAsync();
        }
    }
}
