FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY "backend.csproj"  "./"
RUN dotnet restore "backend.csproj"

COPY . .
RUN dotnet publish "backend.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# De poort waarop de app standaard draait
EXPOSE 5197
ENTRYPOINT ["dotnet", "backend.dll"]