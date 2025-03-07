package com.pinkfactory.genio.infrastructure.adapter.in.spec;

import com.pinkfactory.genio.infrastructure.adapter.in.dto.CardResponse;
import com.pinkfactory.genio.infrastructure.adapter.in.dto.GenerateCardRequest;
import com.pinkfactory.genio.infrastructure.websocket.Event;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@SuppressWarnings("unused")
@Tag(name = "Cards V1", description = "Card management API")
public interface V1CardAPISpecification {

    @Operation(summary = "Generate a new card", description = "Creates a new card based on the provided request body")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Card successfully generated",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = CardResponse.class)))
            })
    ResponseEntity<CardResponse> generateCard(GenerateCardRequest request);

    @Operation(summary = "Generate a new card", description = "Creates a new card based on the provided request body")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        content =
                                @Content(
                                        mediaType = "text/event-stream",
                                        schema = @Schema(implementation = Event.class)))
            })
    SseEmitter generateCardAsStream(GenerateCardRequest request);
}
