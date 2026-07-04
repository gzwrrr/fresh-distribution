package cn.iocoder.yudao.module.wms.framework.config;

import lombok.Data;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Arrays;
import java.util.List;

@Validated
@Data
public class WmsRuntimeProperties {

    @NotNull
    @Min(1)
    @Max(30)
    private Integer nearExpiryAlarmDays = 3;

    @NotNull
    @Min(1)
    @Max(100)
    private Integer lowStockAlertPercent = 15;

    @NotNull
    private Boolean autoAllocateShipment = true;

    @NotBlank
    private String dispatchWaveLabel = "生鲜优先波次";

    @NotEmpty
    private List<String> coldChainWarehouseCodes = Arrays.asList("WH-COLD-SH");

}
