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
using System.Text.RegularExpressions;

namespace ExamWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppEFContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public ProductsController(AppEFContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _configuration = configuration;
        }

        [HttpGet]
        public IActionResult GetList(int page, string search, string sort, int countOnPage = 10)
        {
            var query = _context.Products
                .Include(x => x.Category)
                .Include(x => x.Images.OrderBy(i => i.Priority))
                .AsQueryable();

            query = CreateSearchQuery(query, search);


            switch (sort)
            {
                case Sorts.PriceLowToHigh:
                    query = query.OrderBy(x => x.Price);
                    break;
                case Sorts.PriceHighToLow:
                    query = query.OrderByDescending(x => x.Price);
                    break;
                case Sorts.NameAscending:
                    query = query.OrderBy(x => x.Name);
                    break;
                case Sorts.NameDescending:
                    query = query.OrderByDescending(x => x.Name);
                    break;
                default:
                case Sorts.Default:
                    query = query.OrderBy(x => x.Id);
                    break;
                
            }

            var list = query
                .Skip((page - 1) * countOnPage)
                .Take(countOnPage)
                .Select(x => _mapper.Map<ProductItemViewModel>(x))
                .ToList();
            
            return Ok(list);
        }

        [HttpGet("most-buys")]
        public IActionResult GetList(int count)
        {
            var list = _context.Products
                .Include(x => x.Category)
                .Include(x => x.Images.OrderBy(i => i.Priority))
                .Where(x => !x.IsDeleted)
                .OrderBy(x => x.Id)
                .Take(count)
                .Select(x => _mapper.Map<ProductItemViewModel>(x))
                .ToList();

            return Ok(list);
        }
        //Зробити видалення запиту при виборі категорії на фронті!
        private IQueryable<ProductEntity> CreateSearchQuery(IQueryable<ProductEntity> query, string search)
        {
            if(string.IsNullOrEmpty(search))
                return query;

            List<string> array = new();

            string remainingString = search.Trim();

            while (remainingString.Length > 0)
            {
                Regex categoryRegex = new(@"Категорія:""([^""]+)""");
                Match categoryMatch = categoryRegex.Match(remainingString);

                if (categoryMatch.Success)
                {
                    array.Add(categoryMatch.Groups[0].Value);
                    remainingString = remainingString.Replace(categoryMatch.Groups[0].Value, "");
                }
                else
                {
                    string[] remainingWords = remainingString.Trim().Split(' ');

                    foreach (string word in remainingWords)
                    {
                        array.Add(word);
                    }

                    remainingString = "";
                }
            }

            foreach (var item in array)
            {
                var category = Regex.Match(item, @"(?<=:)(.*)");
                if (category.Success)
                {
                    string val = category.Groups[1].Value.Trim('\"');
                    query = query.Where(x => !x.IsDeleted && x.Category.Name.ToLower().Contains(val.ToLower()));
                }
                else
                {
                    query = query.Where(x => !x.IsDeleted && x.Name.ToLower().Contains(item.ToLower()));
                }
            }

            return query;
        }

        [HttpGet("count")]
        public IActionResult GetCount(string search)
        {
            var query = _context.Products
                .Include(x => x.Category)
                .Include(x => x.Images.OrderBy(i => i.Priority))
                .AsQueryable();

            query = CreateSearchQuery(query, search);

            var count = query.Count();
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
