using ARMenu.Services;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add SignalR
builder.Services.AddSignalR();

// Load MongoDB settings correctly
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));

// Register IMongoClient as a singleton
builder.Services.AddSingleton<IMongoClient>(serviceProvider =>
{
    var settings = serviceProvider.GetRequiredService<IConfiguration>().GetSection("MongoDbSettings").Get<MongoDbSettings>();
    return new MongoClient(settings.ConnectionString);
});
builder.Services.AddScoped<IEmailService, EmailService>();
// Register MongoDbService (Singleton recommended for MongoClient)
builder.Services.AddSingleton<MongoDbService>();

// Register AuthService
builder.Services.AddScoped<AuthService>();


// Debugging: Print the connection string to verify it's loaded correctly
Console.WriteLine($"MongoDB Connection String: {builder.Configuration["MongoDbSettings:ConnectionString"]}");

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins("https://localhost:3000") // Replace with your frontend URL
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Allow credentials for SignalR
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting(); // Ensure routing is enabled

// Use CORS policy
app.UseCors("AllowAll");

app.UseAuthorization();

// Map SignalR hub
app.MapHub<NotificationHub>("/notificationHub");

// Map controllers
app.MapControllers();

app.Run();