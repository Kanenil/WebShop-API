using AutoMapper;
using ExamWebShop.Constants;
using ExamWebShop.Data;
using ExamWebShop.Data.Entities;
using ExamWebShop.Helpers;
using ExamWebShop.Interfaces;
using ExamWebShop.Models.Products;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Drawing.Printing;
using System.Text.RegularExpressions;

namespace ExamWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductsService _productsService;
        private readonly IMapper _mapper;
        public ProductsController(IProductsService productsService, IMapper mapper)
        {
            _productsService = productsService;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetList([FromQuery] ProductSearchViewModel model)
        {
            var query = _productsService.Products
                .Include(x => x.Category)
                .Include(x => x.Images.OrderBy(i => i.Priority))
                .Include(x => x.SaleProducts.Where(x=>x.Sale.ExpireTime > DateTime.UtcNow).OrderByDescending(x => x.Sale.DecreasePercent))
                .ThenInclude(x=>x.Sale)
                .Where(x => !x.IsDeleted)
                .AsQueryable();

            if (!string.IsNullOrEmpty(model.Search))
            {
                var searches = model.Search.Split(' ');
                foreach (var sear in searches)
                {
                    query = query.Where(x => x.Name.ToLower().Contains(sear.ToLower()));
                }
            }

            if (!string.IsNullOrEmpty(model.Category))
            {
                query = query.Where(x => x.Category.Name.ToLower().Contains(model.Category.ToLower()));
            }

            switch (model.Sort)
            {
                case Sorts.PriceLowToHigh:
                    query = query.OrderBy(x => x.SaleProducts.Count > 0 ? x.Price - (x.Price * x.SaleProducts.First().Sale.DecreasePercent) / 100 : x.Price);
                    break;
                case Sorts.PriceHighToLow:
                    query = query.OrderByDescending(x => x.SaleProducts.Count>0? x.Price-(x.Price*x.SaleProducts.First().Sale.DecreasePercent)/100:x.Price);
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
                .Skip((model.Page - 1) * model.CountOnPage)
                .Take(model.CountOnPage)
                .Select(x => _mapper.Map<ProductItemViewModel>(x))
                .ToList();

            int total = query.Count();
            int pages = (int)Math.Ceiling(total / (double)model.CountOnPage);

            return Ok(new ProductSearchResultViewModel()
            {
                CurrentPage = model.Page,
                Pages = pages,
                Total = total,
                Products = list,
            });
        }


        [HttpGet("most-buys")]
        public IActionResult GetList(int count)
        {
            var list = _productsService.Products
                .Include(x => x.Category)
                .Include(x => x.Images.OrderBy(i => i.Priority))
                .Include(x => x.SaleProducts.Where(x => x.Sale.ExpireTime > DateTime.UtcNow).OrderByDescending(x => x.Sale.DecreasePercent))
                .ThenInclude(x => x.Sale)
                .Where(x => !x.IsDeleted)
                .OrderBy(x => x.Id)
                .Take(count)
                .Select(x => _mapper.Map<ProductItemViewModel>(x))
                .ToList();

            return Ok(list);
        }

        [HttpPost]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Create(CreateProductViewModel model)
        {
            if(!ModelState.IsValid)
                return BadRequest();

            var id = await _productsService.Create(model);
            short index = 0;
            foreach (var image in model.Images)
            {
                await _productsService.AddImage(new ProductImageEntity()
                {
                    Name = image,
                    ProductId = id,
                    Priority = ++index
                });
            }

            return Ok();
        }
        [HttpGet("id/{id}")]
        public IActionResult GetProduct(int id)
        {
            var model = _productsService.Products
                .Include(x=>x.Category)
                .Include(x => x.Images.OrderBy(i => i.Priority))
                .Include(x => x.SaleProducts.Where(x => x.ProductId == id).Where(x => x.Sale.ExpireTime > DateTime.UtcNow).OrderByDescending(x => x.Sale.DecreasePercent))
                .ThenInclude(x => x.Sale)
                .SingleOrDefault(x => x.Id == id);
            if (model == null)
                return NotFound();
            return Ok(_mapper.Map<ProductItemViewModel>(model));
        }

        [HttpPut]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Edit([FromBody] EditProductViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            await _productsService.Update(model);

            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Delete(int id)
        {         
            await _productsService.Delete(id);
            return Ok();
        }

    }
}
