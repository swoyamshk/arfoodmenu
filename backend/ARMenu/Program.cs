using ARMenu.Data;
using ARMenu.Services;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Load MongoDB settings correctly
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));

// Register IMongoClient as a singleton
builder.Services.AddSingleton<IMongoClient>(serviceProvider =>
{
    var settings = serviceProvider.GetRequiredService<IConfiguration>().GetSection("MongoDbSettings").Get<MongoDbSettings>();
    return new MongoClient(settings.ConnectionString);
});

// Register MongoDbService (Singleton recommended for MongoClient)
builder.Services.AddSingleton<MongoDbService>();

// Register AuthService
builder.Services.AddScoped<AuthService>();

builder.WebHost.UseUrls("https://0.0.0.0:8080");

// Debugging: Print the connection string to verify it's loaded correctly
Console.WriteLine($"MongoDB Connection String: {builder.Configuration["MongoDbSettings:ConnectionString"]}");

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
        });
});

var app = builder.Build();

app.UseCors("AllowAll");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
