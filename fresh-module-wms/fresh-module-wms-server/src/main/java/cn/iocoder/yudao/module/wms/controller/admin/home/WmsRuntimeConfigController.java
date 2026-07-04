package cn.iocoder.yudao.module.wms.controller.admin.home;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.module.wms.controller.admin.home.vo.WmsRuntimeConfigRespVO;
import cn.iocoder.yudao.module.wms.framework.config.WmsRuntimeProperties;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "管理后台 - WMS 运行时配置")
@RestController
@RequestMapping("/wms/home-statistics")
@Validated
public class WmsRuntimeConfigController {

    @Resource
    private WmsRuntimeProperties runtimeProperties;

    @GetMapping("/runtime-config")
    @Operation(summary = "获取 WMS 运行时配置快照")
    @PreAuthorize("@ss.hasPermission('wms:home:query')")
    public CommonResult<WmsRuntimeConfigRespVO> getRuntimeConfig() {
        WmsRuntimeConfigRespVO respVO = new WmsRuntimeConfigRespVO();
        respVO.setNearExpiryAlarmDays(runtimeProperties.getNearExpiryAlarmDays());
        respVO.setLowStockAlertPercent(runtimeProperties.getLowStockAlertPercent());
        respVO.setAutoAllocateShipment(runtimeProperties.getAutoAllocateShipment());
        respVO.setDispatchWaveLabel(runtimeProperties.getDispatchWaveLabel());
        respVO.setColdChainWarehouseCodes(runtimeProperties.getColdChainWarehouseCodes());
        return success(respVO);
    }

}
