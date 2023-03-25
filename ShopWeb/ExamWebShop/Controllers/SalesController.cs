using AutoMapper;
using ExamWebShop.Constants;
using ExamWebShop.Interfaces;
using ExamWebShop.Models.Categories;
using ExamWebShop.Models.Products;
using ExamWebShop.Models.Sales;
using ExamWebShop.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly ISalesService _salesService;
        private readonly IMapper _mapper;

        public SalesController(ISalesService salesService, IMapper mapper)
        {
            _salesService = salesService;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetList([FromQuery] SearchSaleViewModel model)
        {
            var query = _salesService.Sales
                .Include(x=>x.SaleProducts)
                .Where(x => !x.IsDeleted)
                .Where(x=>x.ExpireTime > DateTime.UtcNow)
                .AsQueryable();

            if (!string.IsNullOrEmpty(model.Search))
            {
                query = query.Where(x => x.Name.ToLower().Contains(model.Search.ToLower()));
            }

            var list = query
                .Skip((model.Page - 1) * model.CountOnPage)
                .Take(model.CountOnPage)
                .Select(x => _mapper.Map<SaleTableItemViewModel>(x))
                .ToList();
            int total = query.Count();
            int pages = (int)Math.Ceiling(total / (double)model.CountOnPage);

            return Ok(new SearchSaleResultViewModel()
            {
                CurrentPage = model.Page,
                Pages = pages,
                Total = total,
                Sales = list,
            });
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var data = _salesService.Sales.Where(x => x.ExpireTime > DateTime.UtcNow).SingleOrDefault(x => x.Id == id);

            if (data == null)
                return NotFound();

            return Ok(_mapper.Map<SaleTableItemViewModel>(data));
        }
        [HttpGet("products/{id}")]
        public IActionResult GetProductsBySale(int id)
        {
            var data = _salesService.Sales
                .Where(x => x.ExpireTime > DateTime.UtcNow)
                .Include(x=>x.SaleProducts)
                .ThenInclude(x=>x.Product)
                .ThenInclude(x=>x.Images)
                .Include(x => x.SaleProducts)
                .ThenInclude(x => x.Product)
                .ThenInclude(x => x.Category)
                .Include(x => x.SaleProducts)
                .ThenInclude(x => x.Product)
                .SingleOrDefault(x => x.Id == id)
                .SaleProducts.Select(x=>x.Product).ToList();

            if (data == null)
                return NotFound();

            return Ok(_mapper.Map<IEnumerable<ProductItemViewModel>>(data));
        }

        [HttpGet("product-sale/{id}")]
        public IActionResult GetByProductIdSale(int id)
        {
            var data = _salesService.SaleProducts.Include(x=>x.Sale).Where(x => x.ProductId == id);

            if (data == null)
                return NotFound();

            return Ok(data.Select(x=>_mapper.Map<SaleTableItemViewModel>(x.Sale)).ToList());
        }

        [HttpGet("admin")]
        [Authorize(Roles = Roles.Admin)]
        public IActionResult GetListAdmin([FromQuery] SearchSaleViewModel model)
        {
            var query = _salesService.Sales
                .Include(x => x.SaleProducts)
                .Where(x => !x.IsDeleted)
                .AsQueryable();

            if (!string.IsNullOrEmpty(model.Search))
            {
                query = query.Where(x => x.Name.ToLower().Contains(model.Search.ToLower()));
            }

            var list = query
                .Skip((model.Page - 1) * model.CountOnPage)
                .Take(model.CountOnPage)
                .Select(x => _mapper.Map<SaleTableItemViewModel>(x))
                .ToList();
            int total = query.Count();
            int pages = (int)Math.Ceiling(total / (double)model.CountOnPage);

            return Ok(new SearchSaleResultViewModel()
            {
                CurrentPage = model.Page,
                Pages = pages,
                Total = total,
                Sales = list,
            });
        }

        [HttpGet("admin/{id}")]
        [Authorize(Roles = Roles.Admin)]
        public IActionResult GetByIdAdmin(int id)
        {
            var data = _salesService.Sales.SingleOrDefault(x => x.Id == id);

            if (data == null)
                return NotFound();

            return Ok(_mapper.Map<SaleTableItemViewModel>(data));
        }

        [HttpPost("add-product")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> AddProductToSale(ProductSaleViewModel model)
        {
            await _salesService.AddToSale(model);
            return Ok();
        }

        [HttpPut("remove-product")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> RemoveProductSale(ProductSaleViewModel model)
        {
            await _salesService.RemoveSale(model);
            return Ok();
        }

        [HttpPost]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Create(SaleCreateViewModel model)
        {
            if (!ModelState.IsValid) 
                return BadRequest();

            await _salesService.Create(model);
            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Delete(int id)
        {
            await _salesService.Delete(id);
            return Ok();
        }

        [HttpPut]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Edit(SaleEditViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            await _salesService.Update(model);
            return Ok();
        }


    }
}
