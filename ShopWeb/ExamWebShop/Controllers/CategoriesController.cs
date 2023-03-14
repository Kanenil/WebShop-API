using AutoMapper;
using ExamWebShop.Constants;
using ExamWebShop.Data;
using ExamWebShop.Data.Entities;
using ExamWebShop.Models.Categories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExamWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = Roles.Admin)]
    public class CategoriesController : ControllerBase
    {
        private readonly AppEFContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public CategoriesController(AppEFContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _configuration = configuration;
        }

        [HttpGet]
        public IActionResult GetList()
        {
            var list = _context.Categories
                .Where(x => !x.IsDeleted)
                .Select(x => _mapper.Map<CategoryItemViewModel>(x))
                .ToList();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public IActionResult GetCategory(int id)
        {
            var model = _context.Categories.SingleOrDefault(x => x.Id == id);
            if (model == null)
                return NotFound();
            return Ok(_mapper.Map<CategoryItemViewModel>(model));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CategoryCreateViewModel model)
        {
            var cat = _mapper.Map<CategoryEntity>(model);
            _context.Categories.Add(cat);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> Edit([FromBody] CategoryEditViewModel model)
        {
            var data = _context.Categories.SingleOrDefault(x => x.Id == model.Id);

            if (!String.IsNullOrEmpty(data.Image) && data.Image != model.Image)
            {
                DeleteAllImages(data.Image);
            }

            data.Image = model.Image;
            data.Name = model.Name;
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var data = _context.Categories.SingleOrDefault(x => x.Id == id);

            if (!String.IsNullOrEmpty(data.Image))
                DeleteAllImages(data.Image);

            data.IsDeleted = true;
            await _context.SaveChangesAsync();

            return Ok();
        }

        private void DeleteAllImages(string fileName)
        {
            try
            {
                string[] imageSizes = ((string)_configuration.GetValue<string>("ImageSizes")).Split(" ");
                foreach (var imageSize in imageSizes)
                {
                    int size = int.Parse(imageSize);
                    string dirRemoveImage = Path.Combine(Directory.GetCurrentDirectory(), "images", $"{size}x{size}_{fileName}");
                    System.IO.File.Delete(dirRemoveImage);
                }
            }
            catch (Exception)
            {

            }
        }
    }
}
