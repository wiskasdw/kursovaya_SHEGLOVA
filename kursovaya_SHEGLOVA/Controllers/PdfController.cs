using ISRPOLectures.Models;
using ISRPOLectures.Services;
using Microsoft.AspNetCore.Mvc;

namespace ISRPOLectures.Controllers
{
    public class PdfController : Controller
    {
        private readonly PdfService _pdfService;

        public PdfController(PdfService pdfService)
        {
            _pdfService = pdfService;
        }

        public IActionResult Upload()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return View("Error");
            }

            await _pdfService.UploadPdf(file);

            return RedirectToAction(nameof(Lectures));
        }

        public IActionResult Lectures()
        {
            var pdfFiles = _pdfService.GetAllPdfs();
            return View(pdfFiles);
        }
        [HttpGet("api/Pdf/GetLectures")]
        public IActionResult GetLectures()
        {
            var pdfFiles = _pdfService.GetAllPdfs();
            return Ok(pdfFiles);
        }
    }
}