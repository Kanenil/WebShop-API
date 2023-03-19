using AutoMapper;
using ExamWebShop.Data;
using ExamWebShop.Data.Entities;
using ExamWebShop.Helpers;
using ExamWebShop.Interfaces;
using ExamWebShop.Models.Products;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Linq;

namespace ExamWebShop.Services
{
    public class ProductsService : IProductsService
    {
        private readonly AppEFContext _context;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        public ProductsService(AppEFContext context, IConfiguration configuration, IMapper mapper)
        {
            _context = context;
            _configuration = configuration;
            _mapper = mapper;
        }

        public IQueryable<ProductEntity> Products => _context.Products;

        public async Task<int> AddImage(ProductImageEntity entity)
        {
            if(entity != null)
            {
                _context.ProductImages.Add(entity);
                await _context.SaveChangesAsync();
                return entity.Id;
            }
            throw new Exception("Parameter 'entity' can not be null!");
        }

        public async Task<int> Create(CreateProductViewModel model)
        {
            if(model != null)
            {
                var entity = _mapper.Map<ProductEntity>(model);
                _context.Products.Add(entity);
                await _context.SaveChangesAsync();
                return entity.Id;
            }
            throw new Exception("Parameter 'entity' can not be null!");
        }

        public async Task<bool> Delete(int id)
        {
            var entity = _context.Products.SingleOrDefault(x => x.Id == id);
            if (entity != null)
            {
                var data = _context.Products.SingleOrDefault(p=>p.Id == entity.Id);
                data.IsDeleted = true;
                await _context.SaveChangesAsync();
                return data.IsDeleted;
            }
            throw new Exception("Parameter 'entity' can not be null!");
        }

        public async Task Update(EditProductViewModel model)
        {
            if(model == null)
                throw new Exception("Parameter 'model' can not be null!");

            var data = _context.Products
                .Include(x => x.Images.OrderBy(i => i.Priority))
                .SingleOrDefault(x => x.Id == model.Id);

            foreach (var image in data.Images)
            {
                if (!model.Images.Contains(image.Name))
                {
                    ImageWorker.DeleteAllImages(image.Name, _configuration);
                    _context.ProductImages.Remove(image);
                }
            }
            await _context.SaveChangesAsync();

            short index = 0;
            foreach (var image in model.Images)
            {
                index++;
                var imageData = _context.ProductImages.SingleOrDefault(x => x.Name == image && x.ProductId == data.Id);
                if (imageData != null)
                {
                    imageData.Priority = index;
                }
                else
                {
                    _context.ProductImages.Add(new ProductImageEntity()
                    {
                        Name = image,
                        ProductId = data.Id,
                        Priority = index
                    });
                }
            }

            data.Name = model.Name;
            data.Description = model.Description;
            data.Price = model.Price;
            data.CategoryId = model.CategoryId;
            await _context.SaveChangesAsync();
        }
    }
}
