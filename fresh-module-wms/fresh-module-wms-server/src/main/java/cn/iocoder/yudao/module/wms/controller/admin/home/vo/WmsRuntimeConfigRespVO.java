package cn.iocoder.yudao.module.wms.controller.admin.home.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Schema(description = "管理后台 - WMS 运行时配置快照 Response VO")
@Data
public class WmsRuntimeConfigRespVO {

    @Schema(description = "近效期预警天数", requiredMode = Schema.RequiredMode.REQUIRED, example = "3")
    private Integer nearExpiryAlarmDays;

    @Schema(description = "低库存预警百分比", requiredMode = Schema.RequiredMode.REQUIRED, example = "15")
    private Integer lowStockAlertPercent;

    @Schema(description = "是否自动分配出库波次", requiredMode = Schema.RequiredMode.REQUIRED, example = "true")
    private Boolean autoAllocateShipment;

    @Schema(description = "当前出库波次标签", requiredMode = Schema.RequiredMode.REQUIRED, example = "生鲜优先波次")
    private String dispatchWaveLabel;

    @Schema(description = "冷链仓编码列表", requiredMode = Schema.RequiredMode.REQUIRED)
    private List<String> coldChainWarehouseCodes;

}
