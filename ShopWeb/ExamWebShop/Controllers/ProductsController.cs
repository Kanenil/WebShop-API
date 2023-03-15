using AutoMapper;
using ExamWebShop.Constants;
using ExamWebShop.Data;
using ExamWebShop.Data.Entities;
using ExamWebShop.Helpers;
using ExamWebShop.Models.Categories;
using ExamWebShop.Models.Products;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace ExamWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppEFContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private const int MaxOnPage = 10;

        public ProductsController(AppEFContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _configuration = configuration;
        }

        [HttpGet]
        public IActionResult GetList(int page, string search)
        {
            int.TryParse(search, out int number);
            var list = _context.Products
                .Include(x => x.Category)
                .Include(x => x.Images.OrderBy(i => i.Priority))
                .Where(x => !x.IsDeleted && (search != null ? (x.Name.ToLower().Contains(search.ToLower()) || x.Id == number || x.Category.Name.ToLower().Contains(search.ToLower())) : true))
                .OrderBy(x => x.Id)
                .Skip((page - 1) * MaxOnPage)
                .Take(MaxOnPage)
                .Select(x => _mapper.Map<ProductItemViewModel>(x))
                .ToList();
            
            return Ok(list);
        }

        [HttpGet("count")]
        public IActionResult GetCount(string search)
        {
            int.TryParse(search, out int number);
            var count = _context.Products
                .Include(x => x.Category)
                .Where(x => !x.IsDeleted && (search != null ? (x.Name.ToLower().Contains(search.ToLower()) || x.Id == number || x.Category.Name.ToLower().Contains(search.ToLower())) : true))
                .Count();
            return Ok(count);
        }
        [HttpPost]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Create([FromBody] CreateProductViewModel model)
        {
            var prod = _mapper.Map<ProductEntity>(model);
            _context.Products.Add(prod);
            await _context.SaveChangesAsync();
            short index = 0;
            foreach (var image in model.Images)
            {
                _context.ProductImages.Add(new ProductImageEntity()
                {
                    Name = image,
                    ProductId = prod.Id,
                    Priority = ++index
                });
            }
            await _context.SaveChangesAsync();
            return Ok();
        }
        [HttpGet("id/{id}")]
        public IActionResult GetProduct(int id)
        {
            var model = _context.Products
                .Include(x=>x.Category)
                .Include(x => x.Images.OrderBy(i => i.Priority))
                .SingleOrDefault(x => x.Id == id);
            if (model == null)
                return NotFound();
            return Ok(_mapper.Map<ProductItemViewModel>(model));
        }

        [HttpPut]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Edit([FromBody] EditProductViewModel model)
        {
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

            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Delete(int id)
        {
            var data = _context.Products.Include(x=>x.Images).SingleOrDefault(x => x.Id == id);

            foreach (var image in data.Images)
                if (!String.IsNullOrEmpty(image.Name))
                    ImageWorker.DeleteAllImages(image.Name, _configuration);

            _context.ProductImages.RemoveRange(data.Images);
            _context.Products.Remove(data);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
