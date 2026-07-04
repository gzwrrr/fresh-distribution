package cn.iocoder.yudao.module.wms.controller.admin.home;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.test.core.ut.BaseMockitoUnitTest;
import cn.iocoder.yudao.module.wms.controller.admin.home.vo.WmsRuntimeConfigRespVO;
import cn.iocoder.yudao.module.wms.framework.config.WmsRuntimeProperties;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.when;

class WmsRuntimeConfigControllerTest extends BaseMockitoUnitTest {

    @InjectMocks
    private WmsRuntimeConfigController controller;

    @Mock
    private WmsRuntimeProperties runtimeProperties;

    @Test
    void shouldReturnRuntimeConfigSnapshot() {
        when(runtimeProperties.getNearExpiryAlarmDays()).thenReturn(5);
        when(runtimeProperties.getLowStockAlertPercent()).thenReturn(18);
        when(runtimeProperties.getAutoAllocateShipment()).thenReturn(false);
        when(runtimeProperties.getDispatchWaveLabel()).thenReturn("晚市优先波次");
        when(runtimeProperties.getColdChainWarehouseCodes()).thenReturn(Arrays.asList("WH-COLD-SH", "WH-COLD-HZ"));

        CommonResult<WmsRuntimeConfigRespVO> result = controller.getRuntimeConfig();

        assertEquals(0, result.getCode());
        assertEquals(5, result.getData().getNearExpiryAlarmDays());
        assertEquals(18, result.getData().getLowStockAlertPercent());
        assertFalse(result.getData().getAutoAllocateShipment());
        assertEquals("晚市优先波次", result.getData().getDispatchWaveLabel());
        assertEquals(Arrays.asList("WH-COLD-SH", "WH-COLD-HZ"), result.getData().getColdChainWarehouseCodes());
    }

}
