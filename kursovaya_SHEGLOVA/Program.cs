using ISRPOLectures.Infrastructure;
using ISRPOLectures.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

namespace ISRPOLectures.Services
{
    public class PdfService
    {
        private readonly DataContext _context;
        private readonly IWebHostEnvironment _environment;

        public PdfService(DataContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        public async Task<PdfFile> UploadPdf(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("File is empty");
            }

            string uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            string uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            var pdfFile = new PdfFile()
            {
                FileName = file.FileName,
                FilePath = "/uploads/" + uniqueFileName,
                UploadDate = DateTime.Now
            };

            _context.PdfFiles.Add(pdfFile);
            await _context.SaveChangesAsync();

            return pdfFile;

        }
        public List<PdfFile> GetAllPdfs()
        {
            return _context.PdfFiles.ToList();
        }
    }
}