using ISRPOLectures.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace ISRPOLectures.Infrastructure
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<PdfFile> PdfFiles { get; set; }
    }
}