package com.example.stylesense_backend.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    @NotEmpty
    @Valid
    private List<OrderItemRequest> items;

    private String shippingAddress;

    @Data
    public static class OrderItemRequest {
        @NotNull
        private Long productId;

        @Min(1)
        private int quantity = 1;
    }
}
