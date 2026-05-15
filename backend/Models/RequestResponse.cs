using System;
using System.Diagnostics;

namespace backend.Models;

public class RequestResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string? ErrorMessage { get; set; }
    public bool IsConflict { get; set; }
    public bool IsBadRequest { get; set; }
    public bool IsNotFound { get; set; }
    public bool IsForbidden { get; set; }

    public RequestResponse<T> Ok(T data)
    {
        return new RequestResponse<T> { Success = true, Data = data };
    }
    public RequestResponse<T> Failure(string errorMessage)
    {
        return new RequestResponse<T> { ErrorMessage = errorMessage };
    }

    public RequestResponse<T> SetIsConflict()
    {
        IsConflict = true;
        return this;
    }

     public RequestResponse<T> SetIsBadRequest()
    {
        IsBadRequest = true;
        return this;
    }
     public RequestResponse<T> SetIsNotFound()
    {
        IsNotFound = true;
        return this;
    }
     public RequestResponse<T> SetIsForbidden()
    {
        IsForbidden = true;
        return this;
    }

}
