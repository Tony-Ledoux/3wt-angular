FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY "backend.csproj" "./"
RUN dotnet restore "backend.csproj"
COPY . .
RUN dotnet publish "backend.csproj" -c Release -o /app/publish

# 🐳 Migrations Stage (Requires SDK + Source)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS migrations
WORKDIR /src
COPY backend.csproj ./
RUN dotnet restore
COPY . .
RUN dotnet tool install --global dotnet-ef || dotnet tool update --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"

# 🚀 Final Runtime Image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends libgssapi-krb5-2 && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "backend.dll"]
